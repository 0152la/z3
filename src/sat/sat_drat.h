/*++
Copyright (c) 2017 Microsoft Corporation

Module Name:

    sat_drat.h

Abstract:
   
    Produce DRAT proofs.

Author:

    Nikolaj Bjorner (nbjorner) 2017-2-3

Notes:

    For DIMACS input it produces DRAT proofs.

    For SMT extensions are as follows:

    Input assertion (trusted modulo internalizer):
      c a <literal>* 0

    Bridge from ast-node to boolean variable:
      c b <bool-var-id> := <ast-node-id> 0

    Definition of an ast node:
      c n <ast-node-id> := <name> <ast-node-id>* 0

    Theory lemma
      c <theory-id> <literal>* 0

    Available theories are:
      - euf   The theory lemma should be a consequence of congruence closure.
      - ba    TBD (need to also log cardinality and pb constraints)

    Life times of theory lemmas is TBD. When they are used for conflict resolution
    they are only used for the next lemma.

--*/
#pragma once

namespace sat {
    class drat {
    public:
        enum status { asserted, learned, deleted, ba, euf };
    private:
        struct watched_clause {
            clause* m_clause;
            literal m_l1, m_l2;
            watched_clause(clause* c, literal l1, literal l2):
                m_clause(c), m_l1(l1), m_l2(l2) {}
        };
        svector<watched_clause>   m_watched_clauses;
        typedef svector<unsigned> watch;
        solver& s;
        clause_allocator        m_alloc;
        std::ostream*           m_out;
        std::ostream*           m_bout;
        ptr_vector<clause>      m_proof;
        svector<status>         m_status;        
        literal_vector          m_units;
        vector<watch>           m_watches;
        svector<lbool>          m_assignment;
        bool                    m_inconsistent;
        unsigned                m_num_add, m_num_del;
        bool                    m_check_unsat, m_check_sat, m_check, m_activity;

        void dump_activity();
        void dump(unsigned n, literal const* c, status st);
        void bdump(unsigned n, literal const* c, status st);
        void append(literal l, status st);
        void append(literal l1, literal l2, status st);
        void append(clause& c, status st);

        bool is_clause(clause& c, literal l1, literal l2, literal l3, status st1, status st2);

        friend std::ostream& operator<<(std::ostream & out, status st);
        status get_status(bool learned) const;

        void declare(literal l);
        void assign(literal l);
        void propagate(literal l);
        void assign_propagate(literal l);
        void del_watch(clause& c, literal l);
        bool is_drup(unsigned n, literal const* c);
        bool is_drat(unsigned n, literal const* c);
        bool is_drat(unsigned n, literal const* c, unsigned pos);
        lbool value(literal l) const; 
        void trace(std::ostream& out, unsigned n, literal const* c, status st);
        void display(std::ostream& out) const;
        void validate_propagation() const;
        bool match(unsigned n, literal const* lits, clause const& c) const;

    public:
        drat(solver& s);
        ~drat();  

        void updt_config();
        void add();
        void add(literal l, bool learned);
        void add(literal l1, literal l2, bool learned);
        void add(clause& c, bool learned);
        void add(literal_vector const& c, status st);
        void add(literal_vector const& c); // add learned clause

        // support for SMT - connect Boolean variables with AST nodes
        // associate AST node id with Boolean variable v
        void bool_def(bool_var v, unsigned n);

        // declare AST node n with 'name' and arguments arg
        void def_begin(unsigned n, symbol const& name);
        void def_add_arg(unsigned arg);
        void def_end();

        // ad-hoc logging until a format is developed
        void log_adhoc(std::function<void(std::ostream&)>& fn);

        bool is_cleaned(clause& c) const;        
        void del(literal l);
        void del(literal l1, literal l2);
        void del(literal_vector const& lits);
        void del(clause& c);

        void verify(clause const& c) { verify(c.size(), c.begin()); }
        void verify(unsigned n, literal const* c);
        void verify(literal l1, literal l2) { literal lits[2] = {l1, l2}; verify(2, lits); }
        void verify(literal l1, literal l2, literal l3) { literal lits[3] = {l1, l2, l3}; verify(3, lits); }

        bool contains(clause const& c) { return contains(c.size(), c.begin()); }
        bool contains(unsigned n, literal const* c);
        bool contains(literal l1, literal l2) { literal lits[2] = {l1, l2}; return contains(2, lits); }
        bool contains(literal l1, literal l2, literal l3) { literal lits[3] = {l1, l2, l3}; return contains(3, lits); }
        bool contains(literal c, justification const& j);

        void check_model(model const& m);
    };

};

